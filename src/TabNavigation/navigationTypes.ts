// navigationTypes.ts
export type RootStackParamList = {
    Dashboard: undefined;
    StoriesList: undefined;
    StoriesDetail: { memoryId: number };
    MemoriesList: undefined;
    WineriesList: undefined;
    UserDashboardScreen: undefined;
    WineDashboardScreen: undefined;
    MemoriesDetails: { id: string };
    RestaurantsList: undefined;
    RestaurantsDetails: { id: number };
    WineriesDetails: { id: number };
    DiscoverWinespages:undefined;
};
