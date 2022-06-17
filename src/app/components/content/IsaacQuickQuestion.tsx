import React, {useRef, useState} from "react";
import {Alert, Button, Col, Row} from "reactstrap";
import * as ApiTypes from "../../../IsaacApiTypes";
import {ContentDTO} from "../../../IsaacApiTypes";
import {IsaacContentValueOrChildren} from "./IsaacContentValueOrChildren";
import {useDispatch} from "react-redux";
import {logAction} from "../../state/actions";
import {determineFastTrackSecondaryAction, useFastTrackInformation} from "../../services/fastTrack";
import {v4 as uuid_v4} from "uuid";
import {ConfidenceQuestions} from "../elements/inputs/ConfidenceQuestions";
import {isCS} from "../../services/siteConstants";
import classNames from "classnames";
import {useLocation} from "react-router-dom";

export const IsaacQuickQuestion = ({doc}: {doc: ApiTypes.IsaacQuickQuestionDTO}) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const fastTrackInfo = useFastTrackInformation(doc, location);
    const [isVisible, setVisible] = useState(false);
    const [hideOptions, setHideOptions] = useState(false);
    const answer: ContentDTO = doc.answer as ContentDTO;
    const secondaryAction = determineFastTrackSecondaryAction(fastTrackInfo);
    const attemptUuid = useRef(uuid_v4().slice(0, 8));

    const toggle = () => {
        const isNowVisible = !isVisible;
        setVisible(isNowVisible);
        if (isNowVisible) {
            const eventDetails = {type: "QUICK_QUESTION_SHOW_ANSWER", questionId: doc.id};
            dispatch(logAction(eventDetails));
        }
    };

    const hideAnswer = () => {
        setVisible(false);
        setHideOptions(false);
        attemptUuid.current = uuid_v4().slice(0, 8);
    };

    // We have 3 possible styles for the Show/Hide options (default, fast-track and confidence check)

    const defaultOptions = () => <Row>
        <Col sm="12" md={{size: 10, offset: 1}}>
            <Button color="secondary" block className={classNames({"active": isVisible})} onClick={toggle}>
                {isVisible ? "Hide answer" : "Show answer"}
            </Button>
        </Col>
    </Row>;

    const fastTrackOptions = () => <div className={"d-flex align-items-stretch flex-column-reverse flex-sm-row flex-md-column-reverse flex-lg-row mb-4"}>
        {secondaryAction && <div className={"m-auto pt-3 pb-1 w-100 w-sm-50 w-md-100 w-lg-50 pr-sm-2 pr-md-0 pr-lg-3"}>
            <input {...secondaryAction} className="h-100 btn btn-outline-primary btn-block" />
        </div>}
        <div className={"m-auto pt-3 pb-1 w-100 w-sm-50 w-md-100 w-lg-50 pl-sm-2 pl-md-0 pl-lg-3"}>
            <input
                onClick={toggle} value={isVisible ? "Hide answer" : "Show answer"}
                className={classNames("h-100 btn btn-secondary btn-block", {"active": isVisible})}
            />
        </div>
    </div>;

    const confidenceOptions = () => <ConfidenceQuestions isVisible={isVisible} setVisible={setVisible}
                                                         hideOptions={hideOptions} setHideOptions={setHideOptions}
                                                         identifier={doc.id} attemptUuid={attemptUuid}
                                                         type={"quick_question"} />;

    // Select which one of the 3 above options styles we need
    const Options = !fastTrackInfo.isFastTrackPage ? fastTrackOptions : (doc.showConfidence ? confidenceOptions : defaultOptions)

    return <form onSubmit={e => e.preventDefault()}>
        <div className="question-component p-md-5">
            <div className={classNames({"quick-question": !fastTrackInfo.isFastTrackPage})}>
                {isCS &&
                    <div className="quick-question-title">
                        <h3>Try it yourself!</h3>
                    </div>
                }
                <div className="question-content clearfix">
                    <IsaacContentValueOrChildren {...doc} />
                </div>
                {<Options/>}
                {isVisible && doc.showConfidence && !fastTrackInfo.isFastTrackPage && <Row className="mt-3">
                    <Col sm="12" md={!fastTrackInfo.isFastTrackPage ? {size: 10, offset: 1} : {}}>
                        <Button color="secondary" block className={"active " + classNames({"hide-answer": isCS})} onClick={hideAnswer}>
                            Hide answer
                        </Button>
                    </Col>
                </Row>}
                {isVisible && <Row>
                    <Col sm="12" md={!fastTrackInfo.isFastTrackPage ? {size: 10, offset: 1} : {}}>
                        <Alert color={isCS ? "hide" : "secondary"}>
                            <IsaacContentValueOrChildren {...answer} />
                        </Alert>
                    </Col>
                </Row>}
            </div>
        </div>
    </form>;
};
