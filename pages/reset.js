import Reset from '../components/Authorisation/Reset';

const ResetPage = props => (
  <div>
    <Reset resetToken={props.query.resetToken} />
  </div>
);

export default ResetPage;
