// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"bytes"
	"encoding/json"

	strfmt "github.com/go-openapi/strfmt"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// EthEstimateGas eth_estimateGas method
// swagger:model eth_estimateGas
type EthEstimateGas struct {
	idField *int64

	jsonrpcField *string

	xSuppressField struct {
	}

	// JSON-RPC parameters (can be empty)
	// Required: true
	Params []interface{} `json:"params"`
}

// ID gets the id of this subtype
func (m *EthEstimateGas) ID() *int64 {
	return m.idField
}

// SetID sets the id of this subtype
func (m *EthEstimateGas) SetID(val *int64) {
	m.idField = val
}

// Jsonrpc gets the jsonrpc of this subtype
func (m *EthEstimateGas) Jsonrpc() *string {
	return m.jsonrpcField
}

// SetJsonrpc sets the jsonrpc of this subtype
func (m *EthEstimateGas) SetJsonrpc(val *string) {
	m.jsonrpcField = val
}

// Method gets the method of this subtype
func (m *EthEstimateGas) Method() string {
	return "eth_estimateGas"
}

// SetMethod sets the method of this subtype
func (m *EthEstimateGas) SetMethod(val string) {

}

// XSuppress gets the x suppress of this subtype
func (m *EthEstimateGas) XSuppress() struct {
} {
	return m.xSuppressField
}

// SetXSuppress sets the x suppress of this subtype
func (m *EthEstimateGas) SetXSuppress(val struct {
}) {
	m.xSuppressField = val
}

// Params gets the params of this subtype

// UnmarshalJSON unmarshals this object with a polymorphic type from a JSON structure
func (m *EthEstimateGas) UnmarshalJSON(raw []byte) error {
	var data struct {

		// JSON-RPC parameters (can be empty)
		// Required: true
		Params []interface{} `json:"params"`
	}
	buf := bytes.NewBuffer(raw)
	dec := json.NewDecoder(buf)
	dec.UseNumber()

	if err := dec.Decode(&data); err != nil {
		return err
	}

	var base struct {
		/* Just the base type fields. Used for unmashalling polymorphic types.*/

		ID *int64 `json:"id"`

		Jsonrpc *string `json:"jsonrpc"`

		Method string `json:"method"`

		XSuppress struct {
		} `json:"x-suppress,omitempty"`
	}
	buf = bytes.NewBuffer(raw)
	dec = json.NewDecoder(buf)
	dec.UseNumber()

	if err := dec.Decode(&base); err != nil {
		return err
	}

	var result EthEstimateGas

	result.idField = base.ID

	result.jsonrpcField = base.Jsonrpc

	if base.Method != result.Method() {
		/* Not the type we're looking for. */
		return errors.New(422, "invalid method value: %q", base.Method)
	}

	result.xSuppressField = base.XSuppress

	result.Params = data.Params

	*m = result

	return nil
}

// MarshalJSON marshals this object with a polymorphic type to a JSON structure
func (m EthEstimateGas) MarshalJSON() ([]byte, error) {
	var b1, b2, b3 []byte
	var err error
	b1, err = json.Marshal(struct {

		// JSON-RPC parameters (can be empty)
		// Required: true
		Params []interface{} `json:"params"`
	}{

		Params: m.Params,
	},
	)
	if err != nil {
		return nil, err
	}
	b2, err = json.Marshal(struct {
		ID *int64 `json:"id"`

		Jsonrpc *string `json:"jsonrpc"`

		Method string `json:"method"`

		XSuppress struct {
		} `json:"x-suppress,omitempty"`
	}{

		ID: m.ID(),

		Jsonrpc: m.Jsonrpc(),

		Method: m.Method(),

		XSuppress: m.XSuppress(),
	},
	)
	if err != nil {
		return nil, err
	}

	return swag.ConcatJSON(b1, b2, b3), nil
}

// Validate validates this eth estimate gas
func (m *EthEstimateGas) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateJsonrpc(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateXSuppress(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateParams(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *EthEstimateGas) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID()); err != nil {
		return err
	}

	return nil
}

var ethEstimateGasTypeJsonrpcPropEnum []interface{}

func init() {
	var res []string
	if err := json.Unmarshal([]byte(`["2.0"]`), &res); err != nil {
		panic(err)
	}
	for _, v := range res {
		ethEstimateGasTypeJsonrpcPropEnum = append(ethEstimateGasTypeJsonrpcPropEnum, v)
	}
}

// property enum
func (m *EthEstimateGas) validateJsonrpcEnum(path, location string, value string) error {
	if err := validate.Enum(path, location, value, ethEstimateGasTypeJsonrpcPropEnum); err != nil {
		return err
	}
	return nil
}

func (m *EthEstimateGas) validateJsonrpc(formats strfmt.Registry) error {

	if err := validate.Required("jsonrpc", "body", m.Jsonrpc()); err != nil {
		return err
	}

	// value enum
	if err := m.validateJsonrpcEnum("jsonrpc", "body", *m.Jsonrpc()); err != nil {
		return err
	}

	return nil
}

func (m *EthEstimateGas) validateXSuppress(formats strfmt.Registry) error {

	if swag.IsZero(m.XSuppress()) { // not required
		return nil
	}

	return nil
}

func (m *EthEstimateGas) validateParams(formats strfmt.Registry) error {

	if err := validate.Required("params", "body", m.Params); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *EthEstimateGas) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *EthEstimateGas) UnmarshalBinary(b []byte) error {
	var res EthEstimateGas
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
