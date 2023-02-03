```ts
Existing: {
    [r]cardHeader(text: string, tooltipText: string): "components/card/CardHeader"
    [r]baseCard: "components/card/BaseCard"
}

ToCreateFromExisting: {
    [s]practiceHistoryTable
    [r]title(text: string, size: small | medium | large)
    [r]metricByDataChart(data)
    [r]sortableTable(data)
}

[r]dashboardStat(title: string, count: number, measurement: string)
    @@title(title, small)
    @@row(style: "align-bottom")
        [s](count)
            style: "text-xl"
        [s](measurement)
            style: "text-sm"

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
    ::default
        @@sortableTable(tableData)
        ->isLoading = @@self::loading
    ::loading
        @@loadingSpinner
        ->!isLoading = @@self::default

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
    ::default
        @@metricByDataChart
    ::loading
        @@loadingSpinner

[s]practiceHistoryCard
    @@baseCard
        @@cardHeader(title: "Practice History", tooltipText: "Your reports from previous practice recordings")
        @@practiceHistoryTable

[s]meetingsSummaryDisplay
    (API)
        ()totalMeetings: number
        ()todaysMeetings: number

    ::default
        @@row
            @@dashboardStat("Total Meetings", totalMeetings, "meetings")
            @@dashboardStat("Today's Meetings", todaysMeetings, "meetings")
    ::loading
        @@loadingSpinner


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
        @@loadingSpinner


[s]dashboard
    @@title("Learning", large)
    @@meetingsSummaryDisplay
    @@recentMeetingsCard

    @@title("Meetings", large)
    @@learningSummaryDisplay
    @@skillSummaryCard

    @@practiceHistoryCard
```
