import './App.css';

import LoginForm from './loginForm';
import RegisterForm from './registerForm';
import Home from './home';
import { BeforeLogin, BookPreview, FrameForAll } from './beforeLogin';
import { PreviewHotRanking } from './beforeLoginHot'
import { BorrowList, BorrowHistory } from './borrow';
import { BookList } from './bookdata';
import { CollectList } from './collect'
import { Self } from './self';
import { InfoCheck, ReaderManage } from './selfadmin'
import { UserProfile } from './selfusrprofile'
import { ProtectedRoute, ProtectResult, PageNotFound } from './other'
import { MessageBoard } from './messageboard'
import { DefaultRecord } from './defaultrecord'
import { HotRanking } from './hotRanking'

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
          <Route path="/preview" element={<FrameForAll />}>
            <Route path="/preview/books" element={<BookPreview />} />
            <Route path="/preview/hotRanking" element={<PreviewHotRanking />} />
          </Route>
          <Route path='/permissionerror' element={<ProtectResult/>}/>
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}>
            <Route path='/home/bookList' element={<BookList />} />
            <Route path='/home/hotRanking' element={<HotRanking />} />
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
