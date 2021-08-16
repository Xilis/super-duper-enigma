export const DEFAULT = {
  routes: (config) => {
    return {
      get: [
        { path: "/status", action: "status" },
        { path: "/swagger", action: "swagger" },

        { path: "/variable/:key", action: "getVariable" },
        { path: "/variables", action: "getAllVariables" },

        { path: "/round/:id", action: "getRound" },
        { path: "/rounds", action: "getAllRounds" },

        { path: "/game/:id", action: "getGame" },
        { path: "/games", action: "getAllGames" },
      ],

      post: [
        { path: "/variable", action: "setVariable" },

        { path: "/game", action: "gameStart" },

        { path: "/bet", action: "betAdd" },
        { path: "/cancelBet", action: "betCancel" },

        { path: "/customer", action: "customerAdd" },
      ],

      // For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      // If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.
      //
      // Learn more here: https://www.actionherojs.com/tutorials/web-server#Routes
      //
      // examples:
      //
      // get: [
      //   { path: '/users', action: 'usersList' }, // (GET) /api/users
      //   { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      // ],
      //
      // post: [
      //   { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      // ],
      //
      // all: [
      //   { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
      // ]
    };
  },
};
