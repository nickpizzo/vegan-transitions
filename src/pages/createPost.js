import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import withAuth from "./../hoc/withAuth";
import { Helmet } from "react-helmet";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import CKEditor from "react-ckeditor-wrapper";
import { CREATE_POST } from "./../queries";

const initialState = {
  country: "",
  region: "",
  category: "",
  body: "",
  error: ""
};

class CreatePost extends React.Component {
  constructor(props) {
    super();
    this.state = {
      ...initialState
    };
  }

  clearState() {
    this.setState({ ...initialState });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  selectCountry(val) {
    this.setState({ country: val });
  }

  selectRegion(val) {
    this.setState({ region: val });
  }

  handleEditorChange(body) {
    this.setState({
      body
    });
  }

  handleSubmit(event, createPost) {
    event.preventDefault();
    createPost()
      .then(this.clearState())
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  validateForm() {
    const { country, region, category, body } = this.state;
    this.state;
    const isInvalid = !country || !region || !category || !body;
    return isInvalid;
  }

  head() {
    return (
      <Helmet bodyAttributes={{ class: "createPostPage" }}>
        <title>Create Story - Vegan Transitions</title>
      </Helmet>
    );
  }

  render() {
    const { country, region, category, body } = this.state;
    this.state;

    return (
      <div className="column column_12_12">
        {this.head()}
        <Mutation
          mutation={CREATE_POST}
          variables={{ country, region, category, body }}
        >
          {(creatPost, { data, loading, error }) => {
            return (
              <div className="signUp authForm">
                <h1 className="dark_headline">Create Story</h1>

                <form onSubmit={event => this.handleSubmit(event, creatPost)}>
                  <div className="form_wrap">
                    <div className="form_row">
                      <div className="form_item">
                        <div className="form_input">
                          <CountryDropdown
                            name="country"
                            value={country}
                            onChange={val => this.selectCountry(val)}
                            priorityOptions={["CA", "US", "GB", "MX"]}
                          />
                          <div className="form_row">
                            <div className="form_item">
                              <div className="form_input">
                                <RegionDropdown
                                  name="region"
                                  country={country}
                                  value={region}
                                  onChange={val => this.selectRegion(val)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form_row">
                            <div className="form_item">
                              <div className="form_input">
                                <input
                                  type="text"
                                  name="category"
                                  placeholder="Category"
                                  value={category}
                                  onChange={this.handleChange.bind(this)}
                                />
                                <span className="bottom_border" />
                              </div>
                            </div>
                          </div>

                          <div className="form_row">
                            <div className="form_item">
                              <div className="form_input">
                                <CKEditor
                                  name="body"
                                  value={body}
                                  onChange={this.handleEditorChange.bind(this)}
                                  config={{
                                    extraAllowedContent:
                                      "div(*); p(*); strong(*);"
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form_buttons">
                            <button
                              className="btn"
                              type="submit"
                              disabled={loading || this.validateForm()}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            );
          }}
        </Mutation>
        ;
      </div>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(CreatePost)
);
