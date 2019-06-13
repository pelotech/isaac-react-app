import React from 'react';
import {FigureDTO} from "../../../IsaacApiTypes";
import {apiHelper} from "../../services/api";
import {IsaacContentValueOrChildren} from "./IsaacContentValueOrChildren";
import {FigureNumberingContext} from "../../../IsaacAppTypes";

interface IsaacFigureProps {
    doc: FigureDTO;
}

// TODO add figure counting and linking
export const IsaacFigure = ({doc}: IsaacFigureProps) => {
    const path = doc.src && apiHelper.determineImageUrl(doc.src);

    return <div className="figure_panel">
        <FigureNumberingContext.Consumer>
            {value => <figure>
                <div className="text-center">
                    {!doc.clickUrl && <img src={path} alt={doc.altText} />}
                    {doc.clickUrl && <a href={doc.clickUrl}><img src={path} alt={doc.altText} /></a>}
                </div>
                <div className="text-center figure-caption">
                    {doc.children && doc.children.length > 0 && <div><strong>Figure {value.nextFigureNumber}</strong></div>}
                    <IsaacContentValueOrChildren encoding={doc.encoding} value={doc.value && `**Figure ${value.nextFigureNumber++}:** ${doc.value}`}>
                        {doc.children}
                    </IsaacContentValueOrChildren>
                    {doc.attribution && <div className="text-muted">{doc.attribution}</div>}
                </div>
            </figure>}
        </FigureNumberingContext.Consumer>
    </div>;
};
