@extends('layouts.auth')

@section('content')
    <div class="login-content">
        <!-- Login -->
        <div class="lc-block toggled" id="l-login">
            <form class="lcb-form" role="form" method="POST" action="{{ url('/login') }}">
                {{ csrf_field() }}

                <div class="input-group m-b-20{{ $errors->has('email') ? ' has-error' : '' }}">
                    <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                    <div class="fg-line">
                        <input type="email" class="form-control" placeholder="Correo electronico" name="email" value="{{ old('email') }}" autofocus>
                        @if ($errors->has('email'))
                            <span class="help-block">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="input-group m-b-20{{ $errors->has('password') ? ' has-error' : '' }}">
                    <span class="input-group-addon"><i class="zmdi zmdi-male"></i></span>
                    <div class="fg-line">
                        <input type="password" class="form-control" placeholder="Password" name="password" required>
                        @if ($errors->has('password'))
                            <span class="help-block">
                                <strong>{{ $errors->first('password') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <div class="checkbox">
                    <label>
                        <input type="checkbox" name="remember" checked="checked">
                        <i class="input-helper"></i>
                        No cerrar sesión
                    </label>
                </div>

                <button type="submit" class="btn btn-login btn-success btn-float">
                    <i class="zmdi zmdi-arrow-forward"></i>
                </button>
            </form>

            <div class="lcb-navigation">
                <a href="{{ url('register') }}" data-ma-action="login-switch" data-ma-block="#l-register"><i class="zmdi zmdi-plus"></i> <span>Nuevo</span></a>
                <a href="{{ url('password/reset') }}" data-ma-action="login-switch" data-ma-block="#l-forget-password"><i>?</i> <span>Recuperar cuenta</span></a>
            </div>
        </div>

    </div>
@endsection
