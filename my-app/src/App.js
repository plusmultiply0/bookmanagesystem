import './App.css';

import LoginForm from './loginForm';
import RegisterForm from './registerForm';
import Home from './home';
import { BeforeLogin, BookPreview } from './beforeLogin';
import { BorrowList, BorrowHistory } from './borrow';
import { BookList } from './bookdata';
import { CollectList } from './collect'
import { Self } from './self';
import { InfoCheck, ReaderManage } from './selfadmin'
import { UserProfile } from './selfusrprofile'
import { ProtectedRoute, ProtectResult, PageNotFound } from './other'
import { MessageBoard } from './messageboard'
import { DefaultRecord } from './defaultrecord'

import {
  BrowserRouter as Router,
  Routes, Route
} from "react-router-dom"


const App = ()=>{
  return(
    <Router>
      <div className="form">
        <Routes>
          <Route path='/login' element={<LoginForm/>}/>
          <Route path='/register' element={<RegisterForm/>}/>
          <Route path="/" element={<BeforeLogin />} />
          <Route path="/bookpreview" element={<BookPreview />} />
          <Route path='/permissionerror' element={<ProtectResult/>}/>
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route path='/home/bookList' element={<BookList />} />
            <Route path='/home/messageBoard' element={<MessageBoard />} />
            <Route path='/home/borrowList' element={<BorrowList/>}/>
            <Route path='/home/borrowHistory' element={<BorrowHistory />} />
            <Route path='/home/defaultRecord' element={<DefaultRecord />} />
            <Route path='/home/collectList' element={<CollectList />} />
            <Route path='/home/self' element={<Self/>}/>
            <Route path='/home/userProfile' element={<UserProfile />} />
            <Route path='/home/infoCheck' element={<InfoCheck />} />
            <Route path='/home/readerManage' element={<ReaderManage />} />
          </Route>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App;
