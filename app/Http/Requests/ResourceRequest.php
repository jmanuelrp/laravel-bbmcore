<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResourceRequest extends FormRequest
{

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return $this->callByRequestMethod('authorize');
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return $this->callByRequestMethod('rules');
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function defaultRules()
	{
		return [];
	}

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function defaultAuthorize()
	{
		return true;
	}

	/**
	 * @param  string $type ['authorize', 'rules']
	 * @return mixed
	 */
	public function callByRequestMethod($type)
	{
		$method = $this->method();
		$class_method = $type.strtoupper($method);

		if (method_exists($this, $class_method)) {
			return $this->$class_method();
		}

		$default_method = 'default'.ucfirst($type);

		return $this->$default_method();
	}

}
