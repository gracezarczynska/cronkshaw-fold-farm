import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import CURRENT_USER_QUERY from './User';

const Supplier = props => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {payload => {
      return props.children(payload)}
    }
  </Query>
);

Supplier.PropTypes = {
  children: PropTypes.func.isRequired,
};

export default Supplier;
