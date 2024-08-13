import './scss/app.scss';
import './lottie';

import { Route, Router } from "@solidjs/router";

import HomeComponent from './pages/Home';
import { MetaProvider } from "@solidjs/meta";
import NotFoundComponent from './pages/NotFound';
import { locales } from './locale';
/* @refresh reload */
import { render } from 'solid-js/web'

const root = document.getElementById('root')

render(() => (
    <MetaProvider>
        <Router>
            <Route path="/:lang?" component={HomeComponent} matchFilters={{ lang: new RegExp(`^(${locales.join('|')})$`) }} />
            <Route path="*404" component={NotFoundComponent} />
        </Router>
    </MetaProvider>
), root!)

