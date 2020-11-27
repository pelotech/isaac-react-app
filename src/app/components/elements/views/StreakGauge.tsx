import React from 'react';
import {UserSnapshot} from "../../../../IsaacAppTypes";
import {buildStyles, CircularProgressbarWithChildren} from "react-circular-progressbar";
import {GRAY_120, progressColours} from "../../../services/constants";

interface StreakGaugeProps {
    streakRecord: UserSnapshot | null | undefined;
}

export const StreakGauge = (props: StreakGaugeProps) => {
    const {streakRecord} = props;
    const streakActivity = streakRecord?.weeklyStreakRecord?.currentActivity || 0;
    const currentStreak = streakRecord?.weeklyStreakRecord?.currentStreak || 0;
    const maxParts = 10;
    return <CircularProgressbarWithChildren value={streakActivity}
        maxValue={maxParts}
        strokeWidth={15}
        styles={buildStyles({
            pathColor: progressColours,
            trailColor: GRAY_120

        })}>
        <div style={{fontSize: 24}}>
            {currentStreak}
        </div>
    </CircularProgressbarWithChildren>
};

export const HeaderStreakGauge = (props: StreakGaugeProps) => {
    const {streakRecord} = props;
    const streakActivity = streakRecord?.weeklyStreakRecord?.currentActivity || 0;
    const currentStreak = streakRecord?.weeklyStreakRecord?.currentStreak || 0;
    const maxParts = 10;
    return <CircularProgressbarWithChildren value={streakActivity}
        maxValue={maxParts}
        styles={buildStyles({
            pathColor: progressColours,
            trailColor: GRAY_120
        })}>
        <div style={{fontSize: 18}}>
            {currentStreak}
        </div>
    </CircularProgressbarWithChildren>
}
