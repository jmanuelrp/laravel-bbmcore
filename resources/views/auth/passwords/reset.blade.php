@extends('layouts.auth')

@section('content')
    <div class="login-content">
        <!-- Forgot Password -->
        <div class="lc-block toggled" id="l-forget-password">
            <form class="lcb-form" role="form" method="POST" action="{{ route('password.request') }}">
                {{ csrf_field() }}

                <input type="hidden" name="token" value="{{ $token }}">

                @if (session('status'))
                    <div class="alert alert-success">
                        {{ session('status') }}
                    </div>
                @endif

                <div class="input-group m-b-20{{ $errors->has('email') ? ' has-error' : '' }}">
                    <span class="input-group-addon"><i class="zmdi zmdi-account"></i></span>
                    <div class="fg-line">
                        <input type="email" class="form-control" placeholder="Correo electronico" name="email" value="{{ $email or  old('email') }}" required autofocus>
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

                <div class="input-group m-b-20{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
                    <span class="input-group-addon"><i class="zmdi zmdi-key"></i></span>
                    <div class="fg-line">
                        <input type="password" class="form-control" name="password_confirmation" placeholder="Confirmar password" required>
                        @if ($errors->has('password_confirmation'))
                            <span class="help-block">
                                <strong>{{ $errors->first('password_confirmation') }}</strong>
                            </span>
                        @endif
                    </div>
                </div>

                <button type="submit" class="btn btn-login btn-success btn-float">
                    <i class="zmdi zmdi-check"></i>
                </button>
            </form>

        </div>
    </div>
@endsection
