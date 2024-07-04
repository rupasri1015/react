import React, { Component, Fragment } from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import 'rc-pagination/assets/index.css'
import '../../scss/app.scss'
import Router from './Router'
import store from './store'
import { getAllCities } from '../../redux/actions/cityListAction'
import ScrollToTop from './ScrollToTop'
import 'rsuite/dist/styles/rsuite-default.css'
import { hotjar } from 'react-hotjar';

// ---------------------------Function call for HotJar integerating-----------------------

// @author Raghavendra
// @dependencies install react-hotjar package 

const hjid = 2568315; //site id of HotJar
const hjsv = 6; // version id of HotJar
hotjar.initialize(hjid, hjsv);
// <!-- Optional identify call -->
hotjar.identify('USER_ID', { userProperty: 'value' });

// ---------------------------------------------------------------------------------------


store.dispatch(getAllCities());

class App extends Component {
	state = {
		loading: true,
		loaded: false
	};

	componentDidMount() {
		window.addEventListener('load', () => {
			this.setState({ loading: false, loaded: true });
		});
	}

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({ loading: false, loaded: true })
    })
  }

  render() {
    const { loaded, loading } = this.state
    return (
      
      <Provider store={store}>

        <BrowserRouter>
          <ScrollToTop>
          
            <Fragment>
              {!loaded
                && (
                  <div className={`load${loading ? '' : ' loaded'}`}>
                    <div className="load__icon-wrap">
                      <svg className="load__icon">
                        <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                      </svg>
                    </div>
                  </div>
                )
              }
              <div>
                <Router />
              </div>
            </Fragment>
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default hot(module)(App);
