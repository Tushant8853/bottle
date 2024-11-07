// navigationTypes.ts
export type RootStackParamList = {
    Dashboard: undefined;
    StoriesList: undefined;
    StoriesDetail: { memoryId: number };
    MemoriesList: undefined;
    Thumbnail:{memoryId: string};
    WineriesList: undefined;
    UserDashboardScreen: undefined;
    WineDashboardScreen: undefined;
    MemoriesDetails: { id: string };
    RestaurantsList: undefined;
    RestaurantsDetails: { id: number };
    WineriesDetails: { id: number };
    DiscoverWinespages:undefined;
    WineListVarietal: {winery_id:number};
    WineListVintage:{winery_id:number , winery_varietals_id:number};
    WineDetails:undefined;
};
