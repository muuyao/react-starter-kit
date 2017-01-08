import { combineReducers } from 'redux';
import planJoin from './planjoin';
import login from './login';

const page = combineReducers({
    planJoin,
    login
});

export default page;
