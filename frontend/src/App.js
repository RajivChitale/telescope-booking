import {Routes, Route} from 'react-router-dom';
import TelescopeBooking from './components/TelescopeBooking';
import TelescopeSlotForm from './components/TelescopeSlotForm';

function App() {
  return (
    <Routes>
        <Route path= '/TelescopeSlotForm' element= { <TelescopeSlotForm/> } ></Route>
        <Route path= '/' element= { <TelescopeBooking/> } ></Route>
    </Routes>
  );
}

export default App;


