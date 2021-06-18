import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from '../../config/axios';
import { useAuth } from '../../shared/contexts';
import { IArticle } from '../../shared/interfaces';

export const Article: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const [article, setArticle] = React.useState<IArticle | undefined>();

  const goToProfile =
    (username: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      navigate(`/profile/${username}`);
    };

  const handleFavorite = async () => {
    if (!article) {
      return;
    }

    if (!auth.user) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.request({
        url: `/articles/${article.slug}/favorite`,
        method: article.favorited ? 'delete' : 'post',
      });

      setArticle(data.article);
    } catch (error) {
      // tratamento do erro, alerta?
    }
  };

  const handleFollow = async () => {
    if (!article) {
      return;
    }

    if (!auth.user) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await axios.request({
        url: `/profiles/${article.author.username}/follow`,
        method: article.author.following ? 'delete' : 'post',
      });

      setArticle({
        ...article,
        author: data.profile,
      });
    } catch (error) {
      // tratamento do erro, alerta?
    }
  };

  const loadArticle = async () => {
    try {
      const { data } = await axios.get(`/articles/${slug}`);

      setArticle(data.article);
    } catch (error) {
      // tratamento do erro, alerta?
    }
  };

  React.useEffect(() => {
    loadArticle();
  }, []);

  if (!article) {
    return null;
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <a href="/#">
              {article.author.image && (
                <img src={article.author.image} alt={article.author.username} />
              )}
            </a>
            <div className="info">
              <a
                href="/#"
                className="author"
                onClick={goToProfile(article.author.username)}
              >
                {article.author.username}
              </a>
              <span className="date">
                {moment(article.createdAt).format('MMMM YYYY')}
              </span>
            </div>
            <button
              className={classNames('btn btn-sm btn-outline-secondary', {
                active: article.author.following,
              })}
              type="button"
              onClick={handleFollow}
            >
              <i className="ion-plus-round" />
              &nbsp;
              {(article.author.following ? 'Unfollow' : 'Follow').concat(
                ` ${article.author.username}`,
              )}
            </button>
            &nbsp;&nbsp;
            <button
              className="btn btn-sm btn-outline-primary"
              type="button"
              onClick={handleFavorite}
            >
              <i className="ion-heart" />
              &nbsp; Favorite Post&nbsp;
              <span className="counter">({article.favoritesCount})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">{article.body}</div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <a href="/#">
              {article.author.image && (
                <img src={article.author.image} alt={article.author.username} />
              )}
            </a>
            <div className="info">
              <a
                href="/#"
                className="author"
                onClick={goToProfile(article.author.username)}
              >
                {article.author.username}
              </a>
              <span className="date">
                {moment(article.createdAt).format('MMMM YYYY')}
              </span>
            </div>
            <button
              className={classNames('btn btn-sm btn-outline-secondary', {
                active: article.author.following,
              })}
              type="button"
              onClick={handleFollow}
            >
              <i className="ion-plus-round" />
              &nbsp;
              {(article.author.following ? 'Unfollow' : 'Follow').concat(
                ` ${article.author.username}`,
              )}
            </button>
            &nbsp;&nbsp;
            <button
              className="btn btn-sm btn-outline-primary"
              type="button"
              onClick={handleFavorite}
            >
              <i className="ion-heart" />
              &nbsp; Favorite Post&nbsp;
              <span className="counter">({article.favoritesCount})</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                />
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                  alt=""
                />
                <button className="btn btn-sm btn-primary" type="button">
                  Post Comment
                </button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="/#" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                    alt=""
                  />
                </a>
                &nbsp;
                <a href="/#" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="/#" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                    alt=""
                  />
                </a>
                &nbsp;
                <a href="/#" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-edit" />
                  <i className="ion-trash-a" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
