import React from 'react';
import {connect} from "react-redux";
import {hideDialog} from "../../redux/dialog/actions";

export const Dialog = (props) => {

  if (props.messages.length === 0) {
    return null;
  }
  const lastMessage = props.messages[0];
  return (<div>
    <div key={lastMessage.id} className="modal" tabIndex="-1" role="dialog" style={{display: 'block', marginTop:300}}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <p>{lastMessage.message}</p>
          </div>
          <div className="modal-footer">
            {
              lastMessage.resolutions.map(resolution =>
                (<button key={resolution.key}
                        type="button"
                        onClick={() => props.callAction(lastMessage, resolution)}
                        className={`btn btn-default ${resolution.primary ? 'btn-primary' : ''}`}
                        data-dismiss="modal">{resolution.message}
                </button>)
              )
            }
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade in" />
  </div>);
};

Dialog.propTypes = {
  messages: React.PropTypes.array
};

const mapStateToProps = (state) => ({
  messages: state.dialogs
});

const mapDispatchToProps = (dispatch) => ({
  callAction: (message, resolution) => dispatch(hideDialog(message.id, resolution.key))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
