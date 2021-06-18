import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router';
import axios from '../../config/axios';
import { useAuth } from '../../shared/contexts';
import { IArticle } from '../../shared/interfaces';

interface INavItem {
  name: string;
  needsAuth?: boolean;
}

const navItems: INavItem[] = [
  {
    name: 'Your Feed',
    needsAuth: true,
  },
  {
    name: 'Global Feed',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [feed, setFeed] = React.useState('Global Feed');
  const [tag, setTag] = React.useState<string | undefined>();

  const [articles, setArticles] = React.useState<IArticle[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);

  const goToProfile =
    (username: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      navigate(`/profile/${username}`);
    };

  const goToArticle = (slug: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate(`/article/${slug}`);
  };

  const handleFavorite = (item: IArticle) => async () => {
    if (!auth.user) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.request({
        url: `/articles/${item.slug}/favorite`,
        method: item.favorited ? 'delete' : 'post',
      });

      setArticles(
        articles.map((article) => {
          if (article.slug === item.slug) {
            return data.article;
          }

          return article;
        }),
      );
    } catch (error) {
      // tratamento do erro, alerta?
    }
  };

  const handleTag = (item: string) => async () => {
    if (item === tag) {
      setTag(undefined);
      return;
    }

    setTag(item);
  };

  const handleNavClick =
    (item: INavItem) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      if (item.needsAuth && !auth.user) {
        return;
      }

      setFeed(item.name);
    };

  const loadArticles = async () => {
    try {
      let url = feed === 'Your Feed' ? '/articles/feed' : '/articles';

      if (tag) {
        url = url.concat(`?tag=${tag}`);
      }

      const { data } = await axios.get(url);

      setArticles(data.articles);
    } catch (error) {
      // tratamento do erro, alerta?
    }
  };

  const loadTags = async () => {
    try {
      const { data } = await axios.get('/tags');

      setTags(data.tags);
    } catch (error) {
      // tratamento do erro, alerta?
    }
  };

  React.useEffect(() => {
    loadArticles();
    loadTags();
  }, [feed, tag]);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.name}>
                    <a
                      className={classNames('nav-link', {
                        disabled: item.needsAuth && !auth.user,
                        active: item.name === feed,
                      })}
                      onClick={handleNavClick(item)}
                      href="/#"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {articles.map((article) => (
              <div className="article-preview">
                <div className="article-meta">
                  <a href="/#" onClick={goToProfile(article.author.username)}>
                    {article.author.image && (
                      <img
                        src={article.author.image}
                        alt={article.author.username}
                      />
                    )}
                  </a>
                  <div className="info">
                    <a href="/#" onClick={goToProfile(article.author.username)}>
                      {article.author.username}
                    </a>
                    <span className="date">
                      {moment(article.createdAt).format('MMMM YYYY')}
                    </span>
                  </div>
                  <button
                    className={classNames(
                      'btn btn-outline-primary btn-sm pull-xs-right',
                      {
                        active: article.favorited,
                      },
                    )}
                    onClick={handleFavorite(article)}
                    type="button"
                  >
                    <i className="ion-heart" />
                    &nbsp;{article.favoritesCount}
                  </button>
                </div>
                <a
                  href="/#"
                  className="preview-link"
                  onClick={goToArticle(article.slug)}
                >
                  <h1>{article.title}</h1>
                  <p>{article.description}</p>
                  <span>Read more...</span>
                </a>
              </div>
            ))}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.map((item) => (
                  <a
                    href="/#"
                    className={classNames('tag-pill tag-default', {
                      'tag-outline': tag === item,
                    })}
                    onClick={handleTag(item)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
