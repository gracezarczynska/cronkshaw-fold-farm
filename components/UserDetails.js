import React, { Component } from 'react';
import Form from './styles/Form';
import styled from 'styled-components';

const Center = styled.div`
    display: flex;
    justify-content: center;
`;

class UserDetails extends Component {
    saveAndContinue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }

    goBack = (e) => {
        e.preventDefault()
        this.props.prevStep()
    }

    uploadFile = async (e, value)=> {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/dtypqgdno/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await res.json();
        this.props.handleImage(value, file.secure_url);
    }

    render(){
        const { values } = this.props;
        return(
            <Form>
                <h1 className="ui centered">Enter Delivery Details</h1>
                <div>
                    <label>Address Line 1</label>
                    <input
                    placeholder='Address'
                    onChange={this.props.handleChange('address1')}
                    defaultValue={values.address1}
                    />
                </div>
                <div>
                    <label>Address Line 2</label>
                    <input
                    placeholder='Address'
                    onChange={this.props.handleChange('address2')}
                    defaultValue={values.address2}
                    />
                </div>
                <div>
                    <label>Postcode</label>
                    <input
                    placeholder='Postcode'
                    onChange={this.props.handleChange('postcode')}
                    defaultValue={values.postcode}
                    />
                </div>
                <div>
                    <label>City</label>
                    <input
                    placeholder='City'
                    onChange={this.props.handleChange('City')}
                    defaultValue={values.city}
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                    placeholder='012345678901'
                    onChange={this.props.handleChange('phone')}
                    defaultValue={values.phone}
                    />
                </div>
                <div>
                    <label>Picture of the house</label>
                    <input
                    type="file"
                    accept="image/*"
                    placeholder='housePicture'
                    onChange={(e) => this.uploadFile(e, 'housePicture')}
                    defaultValue={values.housePicture}
                    />
                </div>
                {values.housePicture && <img src={values.housePicture} alt="Upload Preview" />}
                <div>
                    <label>Picture of a drop off spot <span>(if I am not home)</span></label>
                    <input
                    type='file'
                    accept="image/*"
                    placeholder='dropOffPicture'
                    onChange={(e) => this.uploadFile(e, 'dropOffPicture')}
                    defaultValue={values.dropOffPicture}
                    />
                </div>
                {values.dropOffPicture && <img src={values.dropOffPicture} alt="Upload Preview" />}
                <div>
                    <label>Delivery Instructions</label>
                    <textarea
                    placeholder='Help us find your house; please enter some brief instructions with local landmarks, letting us know if there are any parking restrictions.'
                    onChange={this.props.handleChange('deliveryInstructions')}
                    defaultValue={values.deliveryInstructions}
                    />
                </div>
                <Center>
                    <button onClick={this.goBack}>Go Back to Edit </button>
                    <button onClick={this.saveAndContinue}>Save And Continue </button>
                </Center>
            </Form>
        )
    }
}

export default UserDetails;