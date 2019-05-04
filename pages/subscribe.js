import MainForm from '../components/NewSubscriptionJourney/MainForm';

const Subscribe = props => (
  <div>
    <MainForm produceId={props.query.id} />
  </div>
);

export default Subscribe;
