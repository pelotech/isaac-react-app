import React, {useCallback, useContext} from 'react';
import {VideoDTO} from "../../../IsaacApiTypes";
import {useDispatch, useSelector} from "react-redux";
import {logAction} from "../../state/actions";
import {selectors} from "../../state/selectors";
import {NOT_FOUND} from "../../services/constants";
import ReactGA from "react-ga";
import {AccordionSectionContext} from "../../../IsaacAppTypes";

interface IsaacVideoProps {
    doc: VideoDTO;
}

function rewrite(src: string) {
    const possibleVideoId = /(v=|\/embed\/|\/)([^?&/.]{11})/.exec(src);
    const possibleStartTime = /[?&]t=([0-9]+)/.exec(src);
    if (possibleVideoId) {
        const videoId = possibleVideoId[2];
        const optionalStart = possibleStartTime ? `&start=${possibleStartTime[1]}` : "";
        return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&fs=1&modestbranding=1` +
               `${optionalStart}&origin=${window.location.origin}`
    }
}

function onPlayerStateChange(event: any, wrappedLogAction: (eventDetails: object) => void, pageId?: string) {
    const YT = (window as any).YT;
    let logEventDetails: any = {
        videoUrl: event.target.getVideoUrl(),
        videoPosition: event.target.getCurrentTime(),
    };

    if (pageId) {
        logEventDetails.pageId = pageId;
    }

    switch(event.data) {
        case YT.PlayerState.PLAYING:
            logEventDetails.type = "VIDEO_PLAY";
            break;
        case YT.PlayerState.PAUSED:
            logEventDetails.type = "VIDEO_PAUSE";
            break;
        case YT.PlayerState.ENDED:
            logEventDetails.type = "VIDEO_ENDED";
            delete logEventDetails.videoPosition;
            break;
        default:
            return; // Don't send a log message.
    }

    wrappedLogAction(logEventDetails);
}

export function pauseAllVideos() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command',
            func: 'pauseVideo' }), '*');
    });
}


export function IsaacVideo(props: IsaacVideoProps) {
    const dispatch = useDispatch();
    const {doc: {src, altText}} = props;
    const page = useSelector(selectors.doc.get);
    const pageId = page && page !== NOT_FOUND && page.id || undefined;
    const embedSrc = src && rewrite(src);

    const videoRef = useCallback( node => {
        const $window: any = window;
        if (node !== null && $window.YT) {
            try {
                $window.YT.ready(function() {
                    new $window.YT.Player(node, {
                        events: {
                            'onStateChange': (event: any) => {
                                onPlayerStateChange(event, eventDetails => dispatch(logAction(eventDetails)), pageId);
                            }
                        }
                    });
                });
            } catch (error) {
                console.error("Error with YouTube library: ", error, error.stack);
                ReactGA.exception({
                    description: `youtube_error: ${error?.message || 'problem with YT library'}`,
                    fatal: false
                });
            }
        }
    }, [dispatch, pageId]);


    // Exit early if a parent accordion section is closed (for the sake of pages containing many videos)
    const accordionContext = useContext(AccordionSectionContext);
    const videoInAnAccordion = accordionContext.open !== null;
    if (videoInAnAccordion && !accordionContext.open) {
        return null;
    }

    return <div>
        <div className="no-print content-value text-center">
            { embedSrc ?
                <iframe ref={videoRef} className="mw-100" title={altText} width="614" height="390" src={embedSrc} frameBorder="0" allowFullScreen/>
                : altText
            }
        </div>
        <div className="only-print">
            Video description: {altText || "No text description available"}
        </div>
    </div>;
}
