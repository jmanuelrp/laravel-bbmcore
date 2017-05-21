@extends('layouts.auth')

@section('content')
    <div class="login-content">
        <!-- Forgot Password -->
        <div class="lc-block toggled" id="l-forget-password">
            <form class="lcb-form" role="form" method="POST" action="{{ url('/password/email') }}">
                {{ csrf_field() }}

                @if (session('status'))
                    <div class="alert alert-success">
                        {{ session('status') }}
                    </div>
                @endif

                <p class="text-left">Se enviaran las instrucciónes para recuperar su contraseña al correo registrado.</p>

                <div class="input-group m-b-20">
                    <span class="input-group-addon"><i class="zmdi zmdi-email"></i></span>
                    <div class="fg-line">
                        <input type="email" class="form-control" name="email" value="{{ old('email') }}" placeholder="Correo electronico" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-login btn-success btn-float">
                    <i class="zmdi zmdi-check"></i>
                </button>
            </form>

            <div class="lcb-navigation">
                <a href="{{ url('login') }}" data-ma-action="login-switch" data-ma-block="#l-login"><i class="zmdi zmdi-long-arrow-right"></i> <span>Acceder</span></a>
                <a href="{{ url('register') }}" data-ma-action="login-switch" data-ma-block="#l-register"><i class="zmdi zmdi-plus"></i> <span>Nuevo</span></a>
            </div>
        </div>
    </div>
@endsection
