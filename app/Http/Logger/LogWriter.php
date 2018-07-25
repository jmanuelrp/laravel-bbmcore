<?php

namespace App\Http\Logger;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Spatie\HttpLogger\DefaultLogWriter;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;

class LogWriter extends DefaultLogWriter
{

	public function logRequest(Request $request)
	{
		$method = strtoupper($request->getMethod());

		$user = auth()->user();
		$uri = $request->getPathInfo();

		$user_id = $user ? $user->id : 0;

		$bodyAsJson = $request->except(config('http-logger.except'));

		$log = new Logger(str_pad($user_id, 5, '0', STR_PAD_LEFT));
		$log->pushHandler(new StreamHandler(config('logging.requests.filename')), Logger::INFO);
		$log->info("{$method} {$uri}", $bodyAsJson);
	}

}
