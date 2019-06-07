import {Button, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row} from "reactstrap";
import React, {useState} from "react";
import {LoggedInUser, ValidationUser} from "../../../IsaacAppTypes";
import {UserAuthenticationSettingsDTO} from "../../../IsaacApiTypes";
import {MINIMUM_PASSWORD_LENGTH, validateEmail, validatePassword} from "../../services/validation";
import {resetPassword} from "../../state/actions";

interface UserPasswordProps {
    currentPassword?: string;
    currentUserEmail?: string;
    setCurrentPassword: (e: any) => void;
    myUser: ValidationUser;
    setMyUser: (e: any) => void;
    isNewPasswordConfirmed: boolean;
    setIsNewPasswordConfirmed: (isValid: boolean) => void;
    userAuthSettings: UserAuthenticationSettingsDTO | null;
}

export const UserPassword = (
    {currentPassword, currentUserEmail, setCurrentPassword, myUser, setMyUser, isNewPasswordConfirmed, setIsNewPasswordConfirmed, userAuthSettings}: UserPasswordProps) => {
    const [newPassword, setNewPassword] = useState("");
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);

    const [passwordResetRequested, setPasswordResetRequested] = useState(false);

    const validateNewPasswordsMatch = (newPassword: string, newPasswordCopy: string) => {
        return newPassword === newPasswordCopy;
    };

    const resetPasswordIfValidEmail = () => {
        if (currentUserEmail && validateEmail(currentUserEmail)) {
            resetPassword({email: currentUserEmail});
            setPasswordResetRequested(true);
        }
    };

    return <CardBody>
        {userAuthSettings && userAuthSettings.hasSegueAccount ?
            <Row>
                <Col>
                    <Row>
                        <Col md={{size: 6, offset: 3}}>
                            <FormGroup>
                                <Label htmlFor="password-current">Current Password</Label>
                                <Input
                                    id="password-current" type="password" name="current-password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{size: 6, offset: 3}}>
                            <FormGroup>
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    invalid={!!newPassword && !isNewPasswordValid}
                                    id="new-password" type="password" name="new-password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const newPassword = e.target.value;
                                        setIsNewPasswordValid(validatePassword(newPassword));
                                        setNewPassword(newPassword);
                                    }}
                                    aria-describedby="passwordValidationMessage"
                                    disabled={currentPassword == ""}
                                />
                                {newPassword && !isNewPasswordValid &&
                                    <FormFeedback id="passwordValidationMessage">
                                        {`Passwords must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`}
                                    </FormFeedback>
                                }
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{size: 6, offset: 3}}>
                            <FormGroup>
                                <Label htmlFor="password-confirm">Re-enter New Password</Label>
                                <Input
                                    invalid={isNewPasswordValid && !isNewPasswordConfirmed}
                                    id="password-confirm"
                                    type="password" name="password-confirmation"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const newPasswordCopy = e.target.value;
                                        if (isNewPasswordValid && validateNewPasswordsMatch(newPassword, newPasswordCopy)) {
                                            setMyUser(Object.assign(myUser, {password: newPasswordCopy}))
                                            setIsNewPasswordConfirmed(true);
                                        } else {
                                            setIsNewPasswordConfirmed(false);
                                        }
                                    }} aria-describedby="passwordConfirmationValidationMessage"
                                    disabled={currentPassword == ""}
                                />
                                {isNewPasswordValid && !isNewPasswordConfirmed &&
                                    <FormFeedback id="passwordConfirmationValidationMessage">
                                        New passwords do not match
                                    </FormFeedback>
                                }
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
            : !passwordResetRequested ?
                <React.Fragment>
                    <Row className="pt-4">
                        <Col className="text-center">
                            {userAuthSettings && userAuthSettings.linkedAccounts && <p>
                                You do not currently have a password set for this account; you
                                sign in using {" "}
                                {(userAuthSettings.linkedAccounts).map((linked, index) => {
                                    return <span key={index} className="text-capitalize">{linked.toLowerCase()}</span>;
                                })}.
                            </p>}
                        </Col>
                    </Row>
                    <Row className="pb-4">
                        <Col className="text-center">
                            <Button className="btn-secondary" onClick={resetPasswordIfValidEmail}>
                                Click here to add a password
                            </Button>
                        </Col>
                    </Row>
                </React.Fragment>
                :
                <p>
                    <strong className="d-block">Your password reset request is being processed.</strong>
                    <strong className="d-block">Please check your inbox.</strong>
                </p>
        }
    </CardBody>
};
