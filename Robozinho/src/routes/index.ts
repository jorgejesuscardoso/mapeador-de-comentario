import express from 'express';
import bot from './robot';
import user from './user';
import books from './books';
import house from './houses';
import reset from './userReset';
import botRoute from './bot';
import userShop from './shop';
import bookLunar from './originalLunar';
import chaptersLunar from './chaptersOriginalsLunar';

const Routes = express.Router();
Routes.use(bot);
Routes.use('/users', user)
Routes.use('/v1/story', bookLunar)
Routes.use('/v1/mywork', chaptersLunar)
Routes.use('/books',books);
Routes.use('/houses',house);
Routes.use('/auth',reset);
Routes.use('/bot',botRoute);
Routes.use('/shop', userShop)

export default Routes;