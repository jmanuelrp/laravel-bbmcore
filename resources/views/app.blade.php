<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9"><![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'LARAVEL-BBMCORE') }}</title>

        <!-- Vendor CSS -->
        <link href="./js/vendor/bootstrap-modal/css/bootstrap-modal.css" rel="stylesheet">
        {{-- <link href="./js/vendor/bootstrap-modal/css/bootstrap-modal-bs3patch.css" rel="stylesheet"> --}}
        <link href="./js/vendor/animate.css/animate.min.css" rel="stylesheet">
        <link href="./js/vendor/fontawesome/css/font-awesome.min.css" rel="stylesheet">
        <link href="./js/vendor/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">
        <link href="./js/vendor/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">
        <link href="./js/vendor/messenger/build/css/messenger.css" rel="stylesheet">
        <link href="./js/vendor/messenger/build/css/messenger-theme-flat.css" rel="stylesheet">
        <link href="./js/vendor/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">

        <!-- CSS -->
        <link href="./theme/css/app_1.min.css" rel="stylesheet">
        <link href="./theme/css/app_2.min.css" rel="stylesheet">
        <link href="./css/core.css" rel="stylesheet">
        <link href="./css/app.css" rel="stylesheet">
    </head>

    <body>
        @if (config('app.env') == 'production')
            <header id="header" class="clearfix" data-ma-theme="teal">
        @else
            <header id="header" class="clearfix" data-ma-theme="blue">
        @endif
            <ul class="h-inner">
                <li class="hi-trigger ma-trigger" data-ma-action="sidebar-open" data-ma-target="#sidebar">
                    <div class="line-wrap">
                        <div class="line top"></div>
                        <div class="line center"></div>
                        <div class="line bottom"></div>
                    </div>
                </li>

                <li class="hi-logo hidden-xs">
                    <a href="/">{{ config('app.name', 'LARAVEL-BBMCORE') }}</a>
                </li>
            </ul>

            <!-- Top Search Content -->
            <div class="h-search-wrap" id="search-region">
                <div class="hsw-inner">
                    <i class="hsw-search zmdi zmdi-search"></i>
                    <input type="text">
                    <i class="hsw-close zmdi zmdi-close" data-ma-action="search-close"></i>
                </div>
            </div>
        </header>

        <section id="main">
            <aside id="sidebar" class="sidebar c-overflow">
                <div class="s-profile" id="user-region">
                    <a href="" data-ma-action="profile-menu-toggle">
                        <div class="sp-pic">
                            <img>
                        </div>

                        <div class="sp-info">
                            {{ Auth::user()->name }}

                            <i class="zmdi zmdi-caret-down"></i>
                        </div>
                    </a>

                    <ul class="main-menu">
                        {{-- <li>
                            <a href=""><i class="zmdi zmdi-account"></i> Perfil</a>
                        </li>
                        <li>
                            <a href=""><i class="zmdi zmdi-settings"></i> Configuracion</a>
                        </li> --}}
                        <li>
                            <a href="{{ url('/logout') }}"><i class="zmdi zmdi-time-restore"></i> Cerrar sesión</a>
                        </li>
                    </ul>
                </div>

                <navigation id="menu-region">
                    <ul class="main-menu">
                        <li><a href="#"><i class="zmdi zmdi-home"></i> Inicio</a></li>
                    </ul>
                </navigation>
            </aside>

            <section id="content">
                <div class="container" id="main-container-region"></div>
            </section>
        </section>

        <footer id="footer"></footer>
        <div class='flot-tooltip' class='chart-tooltip'></div>

        <!-- Javascript Libraries -->
        @include('requireconfig')
        <script src="/js/vendor/requirejs/require.js"></script>
    </body>
  </html>
