import React, {lazy, useEffect, useRef, useState} from "react";
import {IsaacContentValueOrChildren} from "./IsaacContentValueOrChildren";
import {ChemicalFormulaDTO, IsaacSymbolicChemistryQuestionDTO} from "../../../IsaacApiTypes";
import katex from "katex";
import {ifKeyIsEnter, isDefined, jsonHelper, useCurrentQuestionAttempt} from "../../services";
import _flattenDeep from 'lodash/flattenDeep';
import {IsaacQuestionProps} from "../../../IsaacAppTypes";

const InequalityModal = lazy(() => import("../elements/modals/inequality/InequalityModal"));

const IsaacSymbolicChemistryQuestion = ({doc, questionId, readonly}: IsaacQuestionProps<IsaacSymbolicChemistryQuestionDTO>) => {

    const { currentAttempt, dispatchSetCurrentAttempt } = useCurrentQuestionAttempt<ChemicalFormulaDTO>(questionId);

    const [modalVisible, setModalVisible] = useState(false);
    const initialEditorSymbols = useRef(jsonHelper.parseOrDefault(doc.formulaSeed, []));

    let currentAttemptValue: any | undefined;
    if (currentAttempt && currentAttempt.value) {
        currentAttemptValue = jsonHelper.parseOrDefault(currentAttempt.value, {result: {tex: '\\textrm{PLACEHOLDER HERE}'}});
    }

    useEffect(() => {
        if (!currentAttempt || !currentAttemptValue || !currentAttemptValue.symbols) return;

        initialEditorSymbols.current = _flattenDeep(currentAttemptValue.symbols);
    }, [currentAttempt, currentAttemptValue]);

    const closeModal = (previousYPosition: number) => () => {
        document.body.style.overflow = "initial";
        setModalVisible(false);
        if (isDefined(previousYPosition)) {
            window.scrollTo(0, previousYPosition);
        }
    };

    const previewText = currentAttemptValue && currentAttemptValue.result && currentAttemptValue.result.tex;

    return (
        <div className="symbolic-question">
            <div className="question-content">
                <IsaacContentValueOrChildren value={doc.value} encoding={doc.encoding}>
                    {doc.children}
                </IsaacContentValueOrChildren>
            </div>
            {/* TODO Accessibility */}
            <div
                role={readonly ? undefined : "button"} className={`eqn-editor-preview rounded ${!previewText ? 'empty' : ''}`} tabIndex={readonly ? undefined : 0}
                onClick={() => !readonly && setModalVisible(true)} onKeyDown={ifKeyIsEnter(() => !readonly && setModalVisible(true))}
                dangerouslySetInnerHTML={{ __html: previewText ? katex.renderToString(previewText) : 'Click to enter your answer' }}
            />
            {modalVisible && <InequalityModal
                close={closeModal(window.scrollY)}
                onEditorStateChange={(state: any) => {
                    dispatchSetCurrentAttempt({ type: 'chemicalFormula', value: JSON.stringify(state), mhchemExpression: (state && state.result && state.result.mhchem) || "" })
                    initialEditorSymbols.current = state.symbols;
                }}
                availableSymbols={doc.availableSymbols}
                initialEditorSymbols={initialEditorSymbols.current}
                editorMode="chemistry"
                questionDoc={doc}
            />}
        </div>
    );
};
export default IsaacSymbolicChemistryQuestion;