import React from 'react';
import publicIp from 'public-ip';

function App() {
  return <WeatherOrNot />;
}

// todo
//   on mount, call ip address api
//   handle button onclick
//   handle forecast display
class WeatherOrNot extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    // call ip
    publicIp
      .v4()
      .then((ip) => {
        console.log(`Your IP: ${ip}`);
        return fetch(`api/forecast/ip?ip=${encodeURIComponent(ip)}`);
      })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((forecast) => console.log(forecast));
  }

  render() {
    return (
      <div>
        <Header />
        <SearchBar />
        <Forecast />
      </div>
    );
  }
}

function Header() {
  return (
    <header>
      <h1>weather-or-not</h1>
    </header>
  );
}

function SearchBar() {
  return (
    <div>
      <input placeholder="Search by location" />
      <button
        type="submit"
        // onClick={this.handleOnClick}
        // disabled={this.state.input.length === 0}
      >
        Submit
      </button>
    </div>
  );
}

function Forecast() {
  return <div></div>;
}

export default App;
