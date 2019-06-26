import React from "react";
import {Link} from "react-router-dom";
import {Container} from "reactstrap";
import {TitleAndBreadcrumb} from "../elements/TitleAndBreadcrumb";

export const ServerError = () => {
    return <Container>
        <div>
            <TitleAndBreadcrumb currentPageTitle="Error" />

            <h3 className="my-4"><small>{"We're sorry, but an error has occurred on the Isaac server!"}</small></h3>

            <h3>
                <small>
                    {"You may want to "}
                    <a
                        role="button"
                        tabIndex={0}
                        href={window.location.href}
                        onKeyPress={() => window.location.reload(true)}
                        onClick={() => window.location.reload(true)}
                    >
                        refresh this page and try again
                    </a>
                    {", "}
                    <Link to="/home">
                        return to our homepage
                    </Link>
                    {", or "}
                    <Link to="/contact">
                        contact
                    </Link>
                    {" or "}
                    <a href="mailto:webmaster@isaaccomputerscience.org">
                        email
                    </a>
                    {" us if this keeps happening."}
                </small>
            </h3>
        </div>
    </Container>;
};
