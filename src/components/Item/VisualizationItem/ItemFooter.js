import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { colors } from '../../../colors';
import { getId } from './plugin';
import InterpretationsComponent from '@dhis2/d2-ui-interpretations';

const style = {
    scrollContainer: {
        overflowY: 'auto',
        height: '370px',
    },
    line: {
        margin: '-1px 0px 0px',
        height: '1px',
        border: 'none',
        backgroundColor: colors.lightGrey,
    },
    descriptionContainer: {
        padding: '5px',
    },
    descriptionTitle: {
        color: colors.black,
        fontSize: '13px',
        fontWeight: 'bold',
        height: '19px',
        lineHeight: '19px',
    },
    descriptionText: {
        fontSize: '13px',
        lineHeight: '17px',
    },
};

const ItemDescription = ({ description }) => {
    return (
        <div style={style.descriptionContainer}>
            <h3 style={style.descriptionTitle}>Description</h3>
            <p style={style.descriptionText}>{description}</p>
        </div>
    );
};

class ItemFooter extends Component {
    render() {
        const objectId = getId(this.props.item);
        
        return (
            <div className="dashboard-item-footer">
                <hr style={style.line} />
                <div style={style.scrollContainer}>
                    <InterpretationsComponent
                        d2={this.context.d2}
                        type={this.props.item.type.toLowerCase()}
                        id={objectId}
                    />
                </div>
            </div>
        );
    }
}

ItemFooter.contextTypes = {
    d2: PropTypes.object.isRequired,
};

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
};

export default ItemFooter;
