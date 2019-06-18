import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Alert, Card, CardTitle, CardBody, Container, Spinner} from "reactstrap";
import {AppState, ContentVersionState} from "../../state/reducers";
import {RegisteredUserDTO} from "../../../IsaacApiTypes";
import {getContentVersion, requestConstantsSegueVersion, setContentVersion} from "../../state/actions";
import {ShowLoading} from "../handlers/ShowLoading";
import {ContentVersionUpdatingStatus} from "../../services/constants";
import {TitleAndBreadcrumb} from "../elements/TitleAndBreadcrumb";

const stateToProps = (state: AppState) => ({
    segueVersion: state && state.constants && state.constants.segueVersion || "unknown",
    contentVersion: state && state.contentVersion || null,
});

const dispatchToProps = {getContentVersion, setContentVersion, requestConstantsSegueVersion};

interface AdminPageProps {
    user: RegisteredUserDTO;
    segueVersion: string;
    contentVersion: ContentVersionState;
    getContentVersion: () => void;
    setContentVersion: (version: string) => void;
    requestConstantsSegueVersion: () => void;
}

const AdminPageComponent = ({user, getContentVersion, setContentVersion, contentVersion, segueVersion, requestConstantsSegueVersion}: AdminPageProps) => {
    useEffect(() => {
        getContentVersion();
    }, []);

    useEffect(() => {
        requestConstantsSegueVersion();
    }, []);

    const [newVersion, setNewVersion] = useState<string | null>(null);

    const startVersionUpdate = function() {
        if (newVersion != null) {
            setContentVersion(newVersion);
        }
    };

    const displayVersion = newVersion || (contentVersion && contentVersion.liveVersion) || null;

    const updateState = contentVersion && contentVersion.updateState || null;

    return <Container id="admin-page">
        <TitleAndBreadcrumb currentPageTitle="Isaac administration" breadcrumbTitleOverride="Admin tools" />

        <div className="py-4">

            Hi, {user.givenName}!

            <Card className="p-3 my-3">
                <CardTitle tag="h2">Useful links</CardTitle>
                <CardBody>
                    <Link to="/admin/usermanager">User Manager</Link>
                </CardBody>
            </Card>

            <Card className="p-3 mb-3">
                <CardTitle tag="h2">Admin Console</CardTitle>
                <CardBody>
                    <ul>
                        <li><strong>API Version:</strong> {segueVersion}</li>
                    </ul>
                </CardBody>
            </Card>

            <Card className="p-3 mb-3">
                <CardTitle tag="h2">Administrative tools</CardTitle>
                <CardBody>
                    <h3>Manage site content</h3>
                    {contentVersion && <React.Fragment>
                        <div>
                            <label htmlFor="content-version">
                                <strong>Live Content Version</strong>
                            </label>
                        </div>
                        <ShowLoading until={displayVersion !== null}>
                            {displayVersion !== null && updateState != ContentVersionUpdatingStatus.UPDATING && <form>
                                <div>
                                    <input type="text" value={displayVersion} onChange={e => setNewVersion(e.target.value)}
                                        placeholder="Enter commit SHA" />
                                </div>
                                <div>
                                    <button type="button" onClick={startVersionUpdate} disabled={displayVersion === contentVersion.liveVersion}>Set Version</button>
                                </div>
                            </form>}
                        </ShowLoading>
                        {updateState == ContentVersionUpdatingStatus.UPDATING &&
                            <Alert color="info">
                                <h4>Updating...</h4>
                                <p>Replacing version {contentVersion.liveVersion} with {contentVersion.updatingVersion}</p>
                                <Spinner />
                            </Alert>
                        }
                        {updateState == ContentVersionUpdatingStatus.SUCCESS &&
                            <Alert color="success">
                                <h4>Content version changed successfully.</h4>
                            </Alert>
                        }
                        {updateState == ContentVersionUpdatingStatus.FAILURE &&
                            <Alert color="danger">
                                <h4>Error: Content version could not be changed.</h4>
                            </Alert>
                        }
                    </React.Fragment>}
                </CardBody>
            </Card>

        </div>
    </Container>;
};

export const Admin = connect(stateToProps, dispatchToProps)(AdminPageComponent);
