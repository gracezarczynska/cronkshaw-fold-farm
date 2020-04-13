import Activate from '../components/Authorisation/Activate';

const ActivatePage = props => (
  <div>
    <Activate activationToken={props.query.activationToken} />
  </div>
);

export default ActivatePage;
