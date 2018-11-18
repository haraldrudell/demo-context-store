// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"strconv"

	strfmt "github.com/go-openapi/strfmt"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/swag"
)

// TickerFullResponse ticker full response
// swagger:model TickerFullResponse
type TickerFullResponse struct {

	// Currency pair base
	Base string `json:"base,omitempty"`

	// Currency pair quote
	Quote string `json:"quote,omitempty"`

	// List of tickers at various exchanges
	Tickers []*TickerFullResponseTickersItems0 `json:"tickers"`
}

// Validate validates this ticker full response
func (m *TickerFullResponse) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateTickers(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *TickerFullResponse) validateTickers(formats strfmt.Registry) error {

	if swag.IsZero(m.Tickers) { // not required
		return nil
	}

	for i := 0; i < len(m.Tickers); i++ {
		if swag.IsZero(m.Tickers[i]) { // not required
			continue
		}

		if m.Tickers[i] != nil {
			if err := m.Tickers[i].Validate(formats); err != nil {
				if ve, ok := err.(*errors.Validation); ok {
					return ve.ValidateName("tickers" + "." + strconv.Itoa(i))
				}
				return err
			}
		}

	}

	return nil
}

// MarshalBinary interface implementation
func (m *TickerFullResponse) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *TickerFullResponse) UnmarshalBinary(b []byte) error {
	var res TickerFullResponse
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// TickerFullResponseTickersItems0 ticker full response tickers items0
// swagger:model TickerFullResponseTickersItems0
type TickerFullResponseTickersItems0 struct {

	// Ask
	Ask float64 `json:"ask,omitempty"`

	// Bid
	Bid float64 `json:"bid,omitempty"`

	// Exchange
	Exchange string `json:"exchange,omitempty"`

	// Unix timestamp
	Timestamp int64 `json:"timestamp,omitempty"`

	// Volume
	Volume float64 `json:"volume,omitempty"`
}

// Validate validates this ticker full response tickers items0
func (m *TickerFullResponseTickersItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (m *TickerFullResponseTickersItems0) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *TickerFullResponseTickersItems0) UnmarshalBinary(b []byte) error {
	var res TickerFullResponseTickersItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
