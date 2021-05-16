import React from 'react';
import publicIp from 'public-ip';

const App = () => <WeatherOrNot />;

class WeatherOrNot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forecast: null,
      loading: true,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  async componentDidMount() {
    const ip = await publicIp.v4();
    const response = await fetch(
      `api/forecast/ip?ip=${encodeURIComponent(ip)}`
    );
    const forecast = await response.json();
    this.setState({ forecast, loading: false });
  }

  render() {
    return (
      <div>
        <Header />
        <SearchBar handleSearch={this.handleSearch} />
        {this.state.loading ? (
          <h3>Loading...</h3>
        ) : (
          <Forecast forecast={this.state.forecast} />
        )}
      </div>
    );
  }

  async handleSearch(query) {
    this.setState({ loading: true });
    const response = await fetch(
      `api/forecast/text?q=${encodeURIComponent(query)}`
    );
    const forecast = await response.json();
    this.setState({ forecast, loading: false });
  }
}

function Header() {
  return (
    <header>
      <h1>weather-or-not</h1>
    </header>
  );
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchText: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSearch(this.state.searchText);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input
            placeholder="Search forecasts by location"
            value={this.state.searchText}
            onChange={this.handleChange}
          />{' '}
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const Forecast = (props) => {
  if (!props.forecast.hasOwnProperty('DailyForecasts'))
    return (
      <div>
        <h3>Error connecting to weather data</h3>
      </div>
    );

  let threeDays = props.forecast.DailyForecasts.slice(0, 3);
  let locationText = `${props.forecast.Location.LocalizedName}, ${props.forecast.Location.AdministrativeArea.LocalizedName}`;

  return (
    <div>
      <p>
        <em>
          Forecast data provided by{' '}
          <a href={props.forecast.Headline.Link}>AccuWeather</a>
        </em>
      </p>
      <h2>{locationText}</h2>
      <p>{props.forecast.Headline.Text}</p>
      {threeDays.map((day) => (
        <WeatherCard forecast={day} key={day.EpochDate} />
      ))}
    </div>
  );
};

const WeatherCard = (props) => {
  const dateObj = new Date(props.forecast.Date);

  let dateString = '';
  if (isToday(dateObj)) dateString = 'Today';
  else if (isTomorrow(dateObj)) dateString = 'Tomorrow';
  else
    dateString = `${dateObj.toLocaleString('default', {
      weekday: 'long',
    })}, ${dateObj.toLocaleString('default', {
      month: 'short',
    })} ${dateObj.getDate()}`;

  return (
    <div>
      <h4>{dateString}</h4>
      <p>
        <b>
          {props.forecast.Temperature.Maximum.Value}
          &#176;
          {props.forecast.Temperature.Maximum.Unit}
        </b>
        {' ' + props.forecast.Temperature.Minimum.Value}
        &#176;
        {props.forecast.Temperature.Minimum.Unit}
      </p>
      <p>Day: {props.forecast.Day.IconPhrase}</p>
      <p>Night: {props.forecast.Night.IconPhrase}</p>
    </div>
  );
};

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const isTomorrow = (someDate) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    someDate.getDate() === tomorrow.getDate() &&
    someDate.getMonth() === tomorrow.getMonth() &&
    someDate.getFullYear() === tomorrow.getFullYear()
  );
};

export default App;
