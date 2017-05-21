@extends('layouts.auth')

@section('content')
    <div class="login-content">
        <!-- Register -->
        <div class="lc-block toggled" id="l-login">
            <form class="lcb-form" role="form" method="POST" action="{{ url('/register') }}">
                {{ csrf_field() }}

                    <div class="input-group m-b-20{{ $errors->has('name') ? ' has-error' : '' }}">
                        <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                        <div class="fg-line">
                            <input type="text" class="form-control" placeholder="Nombre" name="name" value="{{ old('name') }}" required autofocus>
                            @if ($errors->has('name'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('name') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="input-group m-b-20{{ $errors->has('email') ? ' has-error' : '' }}">
                        <span class="input-group-addon"><i class="zmdi zmdi-email"></i></span>
                        <div class="fg-line">
                            <input type="email" class="form-control" placeholder="Correo electronico" name="email" value="{{ old('email') }}" required>
                            @if ($errors->has('email'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="input-group m-b-20{{ $errors->has('password') ? ' has-error' : '' }}">
                        <span class="input-group-addon"><i class="zmdi zmdi-key"></i></span>
                        <div class="fg-line">
                            <input type="password" class="form-control" name="password" placeholder="Password" required>
                            @if ($errors->has('password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="input-group m-b-20">
                        <span class="input-group-addon"><i class="zmdi zmdi-repeat"></i></span>
                        <div class="fg-line">
                            <input type="password" class="form-control" name="password_confirmation" placeholder="Confirmar password" required>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-login btn-success btn-float">
                        <i class="zmdi zmdi-arrow-forward"></i>
                    </button>
                </form>

                <div class="lcb-navigation">
                    <a href="{{ url('login') }}" data-ma-action="login-switch" data-ma-block="#l-login"><i class="zmdi zmdi-long-arrow-right"></i> <span>Acceder</span></a>
                    <a href="{{ url('password/reset') }}" data-ma-action="login-switch" data-ma-block="#l-forget-password"><i>?</i> <span>Recuperar cuenta</span></a>
                </div>
            </div>
        </div>
    </div>
@endsection
