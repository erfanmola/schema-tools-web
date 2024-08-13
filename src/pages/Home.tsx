import './Home.scss';

import * as i18n from "@solid-primitives/i18n";

import { Locale, fetchDictionary, localeDirections } from "../locale";
import { Meta, Title } from "@solidjs/meta";
import { Show, Suspense, createResource, createSignal } from "solid-js";
import { TranslationProvider, useTranslation } from "../context/TranslationContext";

import Header from "../components/Header";
import LottieAnimation from '../components/LottieAnimation.tsx';
import { dict as en_dict } from "../i18n/en.ts";
import { useParams } from "@solidjs/router";

const HomeSectionHero = () => {
    const {t} = useTranslation();

    return (
        <section id="home-section-hero" class="home-section">
            <div>
                <div>
                    <strong>{t('home.title')}</strong>
                    <p>{t('home.hero.description')}</p>
                </div>

                <div>
                    <LottieAnimation lottie='/assets/lotties/tools.json' />
                </div>
            </div>
        </section>
    );
};

const HomeComponent = () => {

    const { lang } = useParams();

    const [locale, setLocale] = createSignal<Locale>((lang ?? 'en') as Locale);

    const [dict] = createResource(locale, fetchDictionary, {
        initialValue: i18n.flatten(en_dict),
    });

    document.querySelector('html')?.setAttribute('dir', localeDirections[lang as Locale] ?? 'ltr')

    dict();

    const t = i18n.translator(dict);

    return (
        <Suspense>
            <Show when={dict()}>
                <Title>{t('home.title')}</Title>
                <Meta name="description" content={t('home.description')} />

                <TranslationProvider value={{ t, locale, setLocale }}>
                    <Header />
                    <HomeSectionHero />
                </TranslationProvider>
            </Show>
        </Suspense>
    );
}

export default HomeComponent;
