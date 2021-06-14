const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'jwt.secret':
        return 'mysupersecret';
      case 'name':
        return 'challenge-api';
    }
  },
};

export default mockedConfigService;
