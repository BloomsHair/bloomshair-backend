import express from 'express';
const router = express.Router();
import {
  create, all, get, patch, remove
} from '../controllers/userController';
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorize";


// create a user
router.post('/create',
  isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'] }),
  create
);
// lists all users
router.get('/', [
  isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'] }),
  all
]);
// get :id user
router.get('/:id', [
  isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
  get
]);
// updates :id user
router.patch('/:id', [
  isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
  patch
]);
// deletes :id user
router.delete('/:id', [
  isAuthenticated,
  isAuthorized({ hasRole: ['admin', 'manager'] }),
  remove
]);
export default router;