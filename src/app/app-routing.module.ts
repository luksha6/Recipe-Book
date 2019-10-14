import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';


const routes: Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'}, // loadChildren -> only load component when user visit that path :: RecipesModule name of the Class inside file recipes.module.ts :: LazyLoading
    {path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule'},
    {path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})], // PreloadAllModules (default is no)
    exports: [RouterModule]
})
export class AppRoutingModule {
}
