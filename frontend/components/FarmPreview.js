import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import FarmStyles from './styles/FarmStyles';

export default class farm extends Component {
    static propTypes = {
        farm: PropTypes.object.isRequired,
    }

    render() {
        const { farm } = this.props;
        return (
            <FarmStyles>
                <Link href={{
                    pathname:"farm",
                    query: { id: farm.id },
                }}>
                    {farm.image && <img src={farm.image} alt ={farm.name} />}
                </Link>
                <h1>
                    <Link href={{
                        pathname:"farm",
                        query: { id: farm.id },
                    }}>
                        <a>{farm.name}</a>
                    </Link>
                </h1>
                <p>{farm.description}</p>
                <p>{farm.postcode}</p>
            </FarmStyles>
        )
    }
}