// navigationTypes.ts
export type RootStackParamList = {
    Dashboard: undefined;
    WineDashboard: undefined;
    StoriesList: undefined;
    StoriesDetail: { memoryId: number };
    MemoriesList: undefined;
    Thumbnail:{memoryId: string};
    WineriesList: undefined;
    UserDashboardScreen: undefined;
    WineDashboardScreen: undefined;
    MemoriesDetails: { id: string};
    RestaurantsList: undefined;
    RestaurantsDetails: { id: number };
    WineriesDetails: { id: number };
    DiscoverWinespages:undefined;
    WineEnjoyed: { winery_id: number };
    WineListVarietal: {winery_id:number};
    WineListVintage:{winery_id:number , winery_varietals_id:number};
    WineDetails: { winery_id: number; winery_varietals_id: number,wine_id:number  };
    Language:undefined;
    EditMyMemories:{ id: string };
    EditMemoryField: { id: string; field: string; value: string };
    Savedmymemories:undefined;
    Savedothermemories:undefined;
    Savedrestaurants:undefined;
    Profile:undefined;
    ChangePwd:undefined;
    NameAndUser_Handle:undefined;
    Savedwineries:undefined;
    Savedstories:undefined;
    Savedwines:undefined;
    Favouritemymemories:undefined;
    Favouriteothersmemories:undefined;
    Favouritewineries:undefined;
    Favouriterestaurants: undefined;
    Favouritestories: undefined;
    Favouritewines: undefined;
    SignUpScreen: undefined;
    LoginScreen: undefined;
    TabNavigation: undefined;
};
