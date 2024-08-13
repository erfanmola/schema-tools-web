import './Header.scss';

import { A, useNavigate } from '@solidjs/router';
import { FiMoon, FiSun } from 'solid-icons/fi';
import { For, Setter, Show, createEffect, createMemo, createSignal, on, onMount } from 'solid-js';
import { Locale, localeDirections, localeFlags, locales } from '../locale';

import { BiLogosTelegram } from 'solid-icons/bi'
import { Dropdown } from 'solid-bootstrap';
import { useTranslation } from '../context/TranslationContext';

export type ThemeMode = 'system' | 'dark' | 'light';

const ThemeModeIcon = (props: {theme: ThemeMode, setTheme: Setter<ThemeMode>}) => {
    return (
        <Show when={props.theme === 'light'} fallback={
            <FiMoon onClick={() => props.setTheme('light')} />
        }>
            <FiSun onClick={() => props.setTheme('dark')} />
        </Show>
    );
};

const Header = () => {
    const {t, setLocale} = useTranslation();
    const navigate = useNavigate();

    let localeItems = createMemo(() => Object.fromEntries(
        locales.map(locale => [
            locale.toString(),
            `${localeFlags[locale]} ${t(`locales.${locale}`)}`,
        ])
    ));

    const [theme, setTheme] = createSignal<ThemeMode>((localStorage.getItem('theme') || 'system') as ThemeMode);

    createEffect(() => {
        let themeMode = theme();

        if (theme() === 'system') {
            if (window.matchMedia) {
                if(window.matchMedia('(prefers-color-scheme: dark)').matches){
                    themeMode = 'dark';
                } else {
                    themeMode = 'light';
                }
            } else {
                themeMode = 'dark';
            }
        }

        setTheme(themeMode);

        document.body.setAttribute('data-bs-theme', themeMode);
    });

    createEffect(on(
        () => theme(),
        () => {
            localStorage.setItem('theme', theme());
        }
    ));

    const StorageEventHandler = (e: StorageEvent) => {
        if (e.key === 'theme') {
            setTheme(e.newValue as ThemeMode);
        }
    };

    onMount(() => {
        window.addEventListener("storage", StorageEventHandler);
    });

    return (
        <header id="header-main">
            <BiLogosTelegram />
            <h1><A href=''>{t('home.title')}</A></h1>

            <nav>
                <ul>
                    <li>
                        <a href='#'>{t('header.menu.documentation')}</a>
                    </li>
                </ul>
            </nav>

            <ul>
                <li>
                    <ThemeModeIcon theme={theme()} setTheme={setTheme} />
                </li>

                <li>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">{t('header.language')}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <For each={Object.keys(localeItems())}>
                                {
                                    (lang) => (
                                        <Dropdown.Item onClick={() => {
                                            navigate(lang == 'en' ? '/' : `/${lang}`, { replace: true });
                                            setLocale(lang);
                                            document.querySelector('html')?.setAttribute('dir', localeDirections[lang as Locale] ?? 'ltr')
                                        }}>{localeItems()[lang]}</Dropdown.Item>
                                    )
                                }
                            </For>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
        </header>
    );
}

export default Header;
