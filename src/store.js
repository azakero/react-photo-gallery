import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { modalReducer } from './reducers/modalReducers';
import { getUserReducer } from './reducers/userReducers';

const reducer = combineReducers( {
    currentModalState: modalReducer,
    user: getUserReducer
} );

const middleware = [ thunk ];

const store = createStore(
    reducer,
    composeWithDevTools( applyMiddleware( ...middleware ) )
);

export default store;