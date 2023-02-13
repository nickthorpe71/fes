```ts
Existing: {
    [g]cardHeader(text: string, tooltipText: string): "components/card/CardHeader"
    [g]baseCard: "components/card/BaseCard"
}

ToCreateFromExisting: {
    [s]practiceHistoryTable
    [g]title(text: string, size: small | medium | large)
    [g]metricByDataChart(data)
    [g]sortableTable(data)
}

[g]cardLoading
    scss: {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    // loading spinner should scale to the size of the card
    @@loadingSpinner

[g]cardErrorReload(onReload: () => void)
    scss: {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    []("Error")
    []button
        []("Reload")
            ->onClick = onReload()

[r]dashboardStat(title: string, count: number, measurement: string)
    @@title(title, small)
    @@row(style: "align-bottom")
        [s](count)
            style: "text-xl"
        [s](measurement)
            style: "text-sm"
    ::loading
        increment numbers when loaded
    ::error
        "error"
        []button
            "reload"
    ::stay at 0

[s]recentMeetingsCard
    (API)tableData {
        columns: {
            key: string;
            label: string;
            value: (item: any) => string;
            sortable: boolean;
            width: string;
            preSortFunction?: (item) => string;
            customRender?: (item: any) => JSX.Element;
        }[]
    }

    ::all
        @@baseCard
            @@cardHeader(title: "Recent Meetings", tooltipText: "Your most recent meeting reports")
        ->hasError = @@self::error
    ::default
        @@sortableTable(tableData)
        ->isLoading = @@self::loading
    ::loading
        @@cardLoading
        ->!isLoading = @@self::default
    ::error
        @@cardError
        ->!hasError = @@self::default

[s]skillSummaryCard
    // needs to do an api call to get skill summary data
    (API)chartData {
        category: string;
        data: {
            XLabel: string;
            metrics: {
                label: string;
                count: number;
            }[]
        }[]
    }[]

    ::all
        @@baseCard
            @@cardHeader(title: "Skill Summary", tooltipText: "Summary of your performance metrics from your practice sessions")
        ->hasError = @@self::error
    ::default
        @@metricByDataChart
        ->isLoading = @@self::loading
    ::loading
        @@cardLoading
        ->!isLoading = @@self::default
    ::error
        @@cardError
        ->!hasError = @@self::default

[s]practiceHistoryCard
    ::all
        @@baseCard
            @@cardHeader(title: "Practice History", tooltipText: "Your reports from previous practice recordings")
        ->hasError = @@self::error
    ::default
        @@practiceHistoryTable
        ->isLoading = @@self::loading
    ::loading
        @@cardLoading
        ->!isLoading = @@self::default
    ::error
        @@cardError
        ->!hasError = @@self::default

[s]meetingsSummaryDisplay
    (API)
        ()totalMeetings: number
        ()todaysMeetings: number

    ::default
        @@row
            @@dashboardStat("Total Meetings", totalMeetings, "meetings")
            @@dashboardStat("Today's Meetings", todaysMeetings, "meetings")
    ::loading
    ::error
        totalMeetings = 0;
        todaysMeetings = 0;



[s]learningSummaryDisplay
    (API)
        ()completedCourses: number
        ()totalLearningTime: number
        ()assignedCourses: number

    ::default
        @@row
            @@dashboardStat("Completed Courses", completedCourses, "courses")
            @@dashboardStat("Total Learning Time", totalLearningTime, "min")
            @@dashboardStat("Assigned Courses", assignedCourses, "courses")
    ::loading
    ::error
        completedCourses = 0;
        totalLearningTime = 0;
        assignedCourses = 0;

[s]dashboard
    @@title("Meetings", large)
    @@meetingsSummaryDisplay
    @@recentMeetingsCard

    @@title("Learning", large)
    @@learningSummaryDisplay
    @@skillSummaryCard

    @@practiceHistoryCard
```
