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
    this.state = {
      forecast: null,
    };
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
      .then((forecast) => this.setState({ forecast }));
  }

  render() {
    return (
      <div>
        <Header />
        <SearchBar />
        {this.state.forecast && <Forecast forecast={this.state.forecast} />}
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

const Forecast = (props) => {
  let threeDays = props.forecast.DailyForecasts.slice(0, 3);
  return (
    <div>
      {threeDays.map((day) => (
        <WeatherCard forecast={day} />
      ))}
    </div>
  );
};

const WeatherCard = (props) => {
  const dateObj = new Date(props.forecast.Date);
  const dateString = `${dateObj.toLocaleString('default', {
    weekday: 'long',
  })} ${dateObj.toLocaleString('default', {
    month: 'short',
  })} ${dateObj.getDate()}`;
  return (
    <div>
      <h2>{dateString}</h2>
    </div>
  );
};

export default App;
