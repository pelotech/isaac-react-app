import React from "react";
import {Tabs} from "./Tabs";
import {Col, Row} from "reactstrap";
import {Link} from "react-router-dom";

export const FeaturedContentTabs = () => (
    <div className="tabs-featured-question">
        <Tabs tabTitleClass="mb-3 mb-md-5">
            {{
                "Featured Question": <Row className="feattab-row">
                    <Col sm="6" md="5" className="feattab-info pl-md-4 pb-5">
                        <h2 className="h-question-mark mb-4">
                            <span>?</span>
                            Trace the code and select the subroutine identifier missing on line 6 and the parameters
                            missing on line 9. The program should register the user and then display the user details.
                        </h2>
                        <pre className="text-monospace">
                            {
                                "1  SUBROUTINE register_user()\n" +
                                "2     user_name ← USERINPUT\n" +
                                "3     user_age ← USERINPUT\n" +
                                "4     user_email ← USERINPUT\n" +
                                "5\n" +
                                "6     __________(user_email, user_name, user_age)\n" +
                                "7  ENDSUBROUTINE\n" +
                                "8\n" +
                                "9  SUBROUTINE display_user_details(__________)\n" +
                                '10    OUTPUT "Name: " + name\n' +
                                '11    OUTPUT "Age: " + age\n' +
                                '12    OUTPUT "Email: " + email\n' +
                                "13 ENDSUBROUTINE\n" +
                                "14\n" +
                                '15 register_user()'
                            }
                        </pre>
                    </Col>
                    <Col
                        sm={{size: 4, offset: 1}}
                        md={{size: 5, offset: 2}}
                        className="feattab-image mt-md-5 text-center"
                    >
                        <img src="/assets/ics_spot.svg" className="img-fluid" alt="Student illustration"/>
                        <h4 className="text-center pt-3">
                            <Link to="/questions/prog_sub_03_aqa">HINTS / ANSWER</Link>
                        </h4>
                    </Col>
                </Row>
            }}
        </Tabs>
    </div>

);
