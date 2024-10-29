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
    RestaurantList: undefined;
    RestaurantsDetails: undefined;
    WineriesDetails: { id: string };
    DiscoverWinespages:undefined;
};
