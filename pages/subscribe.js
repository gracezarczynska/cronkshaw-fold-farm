import MainForm from '../components/MainForm';

const Subscribe = props => (
  <div>
    <MainForm produceId={props.query.id} />
  </div>
);

export default Subscribe;
