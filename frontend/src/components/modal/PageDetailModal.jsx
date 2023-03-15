import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Component} from "react";
import PropTypes from "prop-types";

class PageDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            props: props,
        };
    }

    showModal = () => {
        this.props.onShowModal(false);
    }

    render() {
        const {page} = this.props;

        return (
            <div>
                <Modal
                    show={this.props.show}
                    onHide={this.props.onShowModal}
                    dialogClassName="modal-90w"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit your Task!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut commodi consectetur corporis
                            cum
                            debitis eius eveniet id labore laboriosam nesciunt nobis possimus, quidem repellendus unde
                            velit
                            veritatis voluptatem voluptatum.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.showModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

PageDetailModal.propTypes = {
    show: PropTypes.any,
    onShowModal: PropTypes.any,
    pages: PropTypes.object,
};


export default PageDetailModal;
